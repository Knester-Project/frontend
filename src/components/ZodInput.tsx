import type { FieldValues, UseFormRegister, Path } from 'react-hook-form';

type InputType = 'text' | 'number' | 'email' | 'password' | 'checkbox' | 'radio' | 'date' | 'file' | 'tel';

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
};

const ZodInput = <T extends FieldValues>({ type, placeholder, label, id, value, onChange, pattern, title,
    widthClass = 'w-full', register, name, otherClass, required, autoComplete = 'off' }: InputProps<T>) => {
    return (
        <main className="flex flex-col gap-y-1">
            {label && (
                <label className="font-medium text-foreground text-xs md:text-sm xl:text-base cursor-pointer" htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input {...register(name)} type={type} placeholder={placeholder}
                id={id} value={value} onChange={onChange} pattern={pattern}
                title={title} autoComplete={autoComplete}
                className={`text-sm md:text-base xl:text-lg px-4 py-3 bg-background rounded-lg border border-border duration-300 focus:caret-primary focus:outline-none  ${widthClass} ${otherClass}`}
                required={required}
            />
        </main>
    );
};

export default ZodInput;
