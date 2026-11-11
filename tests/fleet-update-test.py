import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('updater', Path(__file__).resolve().parents[1] / 'tools/fleet-update.py')
module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)

class PromotionTest(unittest.TestCase):
    def test_failed_health_restores_previous_current(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve(); old = root / 'old'; new = root / 'new'
            for path in [old, new]:
                path.mkdir(); (path / '.release-sha').write_text(path.name)
            module.atomic_link(root, 'current', old)
            calls = []
            module.api = lambda c, path, method='GET': calls.append(path) or {}
            module.drain = lambda c: calls.append('drain')
            def check(c, sha):
                if sha == 'new': raise RuntimeError('post-start health failed')
            module.wait_worker = check
            with self.assertRaisesRegex(RuntimeError, 'post-start'):
                module.promote({'root': directory}, new)
            self.assertEqual((root / 'current').resolve(), old)
            self.assertEqual(calls.count('/admin/reload'), 2)
            self.assertFalse((root / 'previous').exists())

    def test_promotion_preserves_previous(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve(); old = root / 'old'; new = root / 'new'
            for path in [old, new]:
                path.mkdir(); (path / '.release-sha').write_text(path.name)
            module.atomic_link(root, 'current', old)
            module.promote({'root': directory}, new, live=False)
            self.assertEqual((root / 'previous').resolve(), old)
            self.assertEqual((root / 'current').resolve(), new)

    def test_concurrent_installer_and_updater_cannot_both_hold_lock(self):
        with tempfile.TemporaryDirectory() as directory:
            with module.lock(Path(directory) / 'update.lock'):
                with self.assertRaises(BlockingIOError):
                    with module.lock(Path(directory) / 'update.lock'): pass

if __name__ == '__main__': unittest.main()
