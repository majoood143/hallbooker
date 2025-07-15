import React from 'react';
import { useRTL } from '../../contexts/RTLContext';
import { getTextDirection } from '../../utils/rtlUtils';

const Input = React.forwardRef(({
    type = 'text',
    label,
    placeholder,
    error,
    helperText,
    disabled = false,
    required = false,
    className = '',
    value,
    onChange,
    ...rest
}, ref) => {
    const { isRTL } = useRTL();
    
    // Determine text direction based on content
    const textDirection = getTextDirection(value || placeholder || '');
    const inputDirection = textDirection === 'rtl' || isRTL ? 'rtl' : 'ltr';
    
    // Base input classes
    const baseClasses = 'form-input transition-all duration-200';
    
    // Error state classes
    const errorClasses = error 
        ? 'border-error focus:ring-error focus:border-error' :'border-border focus:ring-primary focus:border-primary';
        
    // Disabled state classes
    const disabledClasses = disabled 
        ? 'bg-secondary-50 text-text-muted cursor-not-allowed' :'bg-surface text-text-primary';
    
    // RTL classes
    const rtlClasses = isRTL ? 'text-right' : 'text-left';
    
    // Combine all classes
    const inputClasses = `
        ${baseClasses}
        ${errorClasses}
        ${disabledClasses}
        ${rtlClasses}
        ${className}
    `;

    return (
        <div className="w-full">
            {label && (
                <label className={`form-label ${isRTL ? 'text-right' : 'text-left'}`}>
                    {label}
                    {required && (
                        <span className="text-error ml-1">*</span>
                    )}
                </label>
            )}
            
            <input
                ref={ref}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                value={value}
                onChange={onChange}
                dir={inputDirection}
                className={inputClasses}
                {...rest}
            />
            
            {error && (
                <p className={`mt-1 text-sm text-error ${isRTL ? 'text-right' : 'text-left'}`}>
                    {error}
                </p>
            )}
            
            {helperText && !error && (
                <p className={`mt-1 text-sm text-text-muted ${isRTL ? 'text-right' : 'text-left'}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
});

export default Input;