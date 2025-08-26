import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormField from '../FormField';

describe('FormField Component', () => {
  it('renders input field with label', () => {
    const mockOnChange = jest.fn();
    render(
      <FormField
        label="Test Label"
        name="test"
        value=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders required indicator when required', () => {
    const mockOnChange = jest.fn();
    render(
      <FormField
        label="Required Field"
        name="test"
        value=""
        onChange={mockOnChange}
        required
      />
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const mockOnChange = jest.fn();
    render(
      <FormField
        label="Test Field"
        name="test"
        value=""
        onChange={mockOnChange}
        error="This field is required"
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const mockOnChange = jest.fn();
    render(
      <FormField
        label="Test Field"
        name="test"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('renders select field when type is select', () => {
    const mockOnChange = jest.fn();
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ];
    
    render(
      <FormField
        label="Select Field"
        name="test"
        type="select"
        value=""
        onChange={mockOnChange}
        options={options}
      />
    );
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders textarea when type is textarea', () => {
    const mockOnChange = jest.fn();
    render(
      <FormField
        label="Textarea Field"
        name="test"
        type="textarea"
        value=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('renders disabled state correctly', () => {
    const mockOnChange = jest.fn();
    render(
      <FormField
        label="Disabled Field"
        name="test"
        value=""
        onChange={mockOnChange}
        disabled
      />
    );
    
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});