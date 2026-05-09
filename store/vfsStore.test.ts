import { describe, it, expect, beforeEach } from 'vitest';
import { useVFSStore } from './vfsStore';

describe('vfsStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useVFSStore.setState({
      vfs: {
        '/': { type: 'dir', children: ['cyber-nexus'] },
        '/cyber-nexus': { type: 'dir', children: ['README.md'] },
        '/cyber-nexus/README.md': { type: 'file', content: 'Welcome to the Nexus.\nInitialize your environment.' },
      },
      currentPath: '/',
      history: [{ type: 'system', content: 'SYSTEM INITIALIZED' }],
    });
  });

  it('should initialize with correct default state', () => {
    const state = useVFSStore.getState();
    expect(state.currentPath).toBe('/');
    expect(state.vfs['/cyber-nexus']).toBeDefined();
  });

  it('should execute ls correctly in root', () => {
    const { executeCommand } = useVFSStore.getState();
    executeCommand('ls');
    
    const { history } = useVFSStore.getState();
    const lastOutput = history[history.length - 1];
    expect(lastOutput.content).toContain('cyber-nexus');
  });

  it('should execute ls correctly with nested paths', () => {
    const { executeCommand } = useVFSStore.getState();
    executeCommand('ls cyber-nexus');
    
    const { history } = useVFSStore.getState();
    const lastOutput = history[history.length - 1];
    expect(lastOutput.content).toContain('README.md');
  });

  it('should handle complex cd path resolution', () => {
    const { executeCommand } = useVFSStore.getState();
    
    executeCommand('cd cyber-nexus');
    expect(useVFSStore.getState().currentPath).toBe('/cyber-nexus');

    executeCommand('cd ..');
    expect(useVFSStore.getState().currentPath).toBe('/');
    
    executeCommand('cd /cyber-nexus/../cyber-nexus/');
    expect(useVFSStore.getState().currentPath).toBe('/cyber-nexus');
  });

  it('should create directories with mkdir', () => {
    const { executeCommand } = useVFSStore.getState();
    executeCommand('cd cyber-nexus');
    executeCommand('mkdir logs');
    
    const state = useVFSStore.getState();
    expect(state.vfs['/cyber-nexus/logs']).toBeDefined();
    expect(state.vfs['/cyber-nexus/logs'].type).toBe('dir');
  });

  it('should create nested files with touch', () => {
    const { executeCommand } = useVFSStore.getState();
    executeCommand('mkdir /cyber-nexus/logs');
    executeCommand('touch /cyber-nexus/logs/session.log');
    
    const state = useVFSStore.getState();
    expect(state.vfs['/cyber-nexus/logs/session.log']).toBeDefined();
    expect(state.vfs['/cyber-nexus/logs/session.log'].type).toBe('file');
  });

  it('should print file content with cat', () => {
    const { executeCommand } = useVFSStore.getState();
    executeCommand('cat cyber-nexus/README.md');
    
    const state = useVFSStore.getState();
    const lastOutput = state.history[state.history.length - 1];
    expect(lastOutput.content).toContain('Welcome to the Nexus.');
  });
  
  it('should remove files with rm', () => {
    const { executeCommand } = useVFSStore.getState();
    executeCommand('rm cyber-nexus/README.md');
    
    const state = useVFSStore.getState();
    expect(state.vfs['/cyber-nexus/README.md']).toBeUndefined();
  });

  it('should print current directory with pwd', () => {
    const { executeCommand } = useVFSStore.getState();
    executeCommand('cd cyber-nexus');
    executeCommand('pwd');
    
    const state = useVFSStore.getState();
    const lastOutput = state.history[state.history.length - 1];
    expect(lastOutput.content).toBe('/cyber-nexus');
  });

  it('should copy files with cp', () => {
    const { executeCommand } = useVFSStore.getState();
    executeCommand('cp cyber-nexus/README.md cyber-nexus/README-copy.md');
    
    const state = useVFSStore.getState();
    expect(state.vfs['/cyber-nexus/README-copy.md']).toBeDefined();
    expect(state.vfs['/cyber-nexus/README-copy.md'].type).toBe('file');
    // @ts-expect-error - we know it's a file
    expect(state.vfs['/cyber-nexus/README-copy.md'].content).toBe('Welcome to the Nexus.\nInitialize your environment.');
  });

  it('should move/rename files with mv', () => {
    const { executeCommand } = useVFSStore.getState();
    executeCommand('mv cyber-nexus/README.md cyber-nexus/README-renamed.md');
    
    const state = useVFSStore.getState();
    expect(state.vfs['/cyber-nexus/README.md']).toBeUndefined();
    expect(state.vfs['/cyber-nexus/README-renamed.md']).toBeDefined();
    expect(state.vfs['/cyber-nexus/README-renamed.md'].type).toBe('file');
  });
});
