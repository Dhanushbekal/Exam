import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModalButton from './ModalButton';

describe('ModalButton', () => {
  it('renders with children correctly', () => {
    render(<ModalButton>Test Button</ModalButton>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<ModalButton onClick={handleClick}>Click Me</ModalButton>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<ModalButton className="custom-class">Styled Button</ModalButton>);
    expect(screen.getByText('Styled Button')).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<ModalButton disabled>Disabled Button</ModalButton>);
    expect(screen.getByText('Disabled Button')).toBeDisabled();
  });

  it('is not disabled by default', () => {
    render(<ModalButton>Enabled Button</ModalButton>);
    expect(screen.getByText('Enabled Button')).not.toBeDisabled();
  });
}); 