import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Coverage & CI Verification', () => {
  it('should have the GitHub Actions workflow file', () => {
    const workflowPath = path.resolve(process.cwd(), '.github/workflows/test.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);
  });

  it('should have coverage configured in vitest.config.ts', () => {
    const configContent = fs.readFileSync(path.resolve(process.cwd(), 'vitest.config.ts'), 'utf-8');
    expect(configContent).toContain('coverage:');
    expect(configContent).toContain('thresholds:');
  });

  it('should have coverage enabled in scripts', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8')
    );
    expect(packageJson.scripts['test:coverage']).toContain('--coverage');
  });
});
