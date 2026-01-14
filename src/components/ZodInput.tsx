import type { FieldValues, UseFormRegister, Path } from 'react-hook-form';

type InputType = 'text' | 'number' | 'email' | 'password' | 'checkbox' | 'radio' | 'date' | 'datetime-local' | 'file' | 'tel' | 'url';

type InputProps<T extends FieldValues> = {
    type: InputType;
    placeholder?: string;
    label?: string;
    id?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    pattern?: string;
    title?: string;
    widthClass?: string;
    register: UseFormRegister<T>;
    name: Path<T>;
    required?: boolean;
    otherClass?: string;
    autoComplete?: string;
    disabled?: boolean;
};

const ZodInput = <T extends FieldValues>({ type, placeholder, label, id, value, onChange, pattern, title,
    widthClass = 'w-full', register, name, otherClass, required, autoComplete = 'off', disabled }: InputProps<T>) => {
    return (
        <main className="flex flex-col gap-y-1">
            {label && (
                <label className="font-medium text-foreground text-xs md:text-sm xl:text-base cursor-pointer" htmlFor={id}>
                    {label}
                    {required && <span className="text-destructive">*</span>}
                </label>
            )}
            <input {...register(name)} type={type} placeholder={placeholder}
                id={id} value={value} onChange={onChange} pattern={pattern}
                title={title} autoComplete={autoComplete}
                className={`px-4 py-3 bg-background rounded-lg border border-border duration-300 focus:caret-primary focus:border-primary focus:outline-none  ${widthClass} ${otherClass}`}
                required={required} disabled={disabled}
            />
        </main>
    );
};

export default ZodInput;
