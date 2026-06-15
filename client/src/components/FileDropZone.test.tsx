import { render, screen, fireEvent } from '@testing-library/react';
import { FileDropZone } from './FileDropZone';
import { describe, it, expect, vi } from 'vitest';

describe('FileDropZone component', () => {
  it('renders correctly without error', () => {
    render(<FileDropZone onFileSelect={vi.fn()} />);
    expect(screen.getByText(/Drop your file here/i)).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<FileDropZone onFileSelect={vi.fn()} error="File too large" />);
    expect(screen.getByText('File too large')).toBeInTheDocument();
  });

  it('calls onFileSelect when a file is dropped', async () => {
    const handleFileSelect = vi.fn();
    render(<FileDropZone onFileSelect={handleFileSelect} />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const dropzone = screen.getByRole('region', { name: /file drop zone/i });
    
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    
    expect(handleFileSelect).toHaveBeenCalledTimes(1);
    expect(handleFileSelect).toHaveBeenCalledWith(file);
  });
});
