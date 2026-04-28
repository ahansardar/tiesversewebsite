from pathlib import Path

def print_tree(directory, output_file=None, ignore_dirs={'.venv', '__pycache__', '.git', 'node_modules', '.pytest_cache', '.egg-info'}):
    lines = []
    
    def walk(path, prefix=''):
        try:
            items = sorted(Path(path).iterdir(), key=lambda x: (not x.is_dir(), x.name))
            dirs = [x for x in items if x.is_dir() and x.name not in ignore_dirs]
            files = [x for x in items if x.is_file()]
            all_items = dirs + files
            
            for i, item in enumerate(all_items):
                is_last = (i == len(all_items) - 1)
                current_prefix = '└── ' if is_last else '├── '
                lines.append(prefix + current_prefix + item.name)
                
                if item.is_dir():
                    next_prefix = prefix + ('    ' if is_last else '│   ')
                    walk(item, next_prefix)
        except PermissionError:
            pass
    
    lines.append(Path(directory).name + '/')
    walk(directory, '')
    
    output = '\n'.join(lines)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(output)
    print('Directory structure saved to ' + output_file)

print_tree('.', output_file='directory_structure.txt')
