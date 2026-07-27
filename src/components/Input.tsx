type InputType = 'text' | 'number' | 'email' | 'password' | 'checkbox' | 'radio' | 'date' | 'datetime-local' | 'file' | 'tel' | 'url';

type InputProps = {
    type: InputType;
    placeholder?: string;
    label?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    pattern?: string;
    title?: string;
    widthClass?: string;
    name: string;
    required?: boolean;
    otherClass?: string;
    autoComplete?: string;
    max?: number;
};

const Input = ({ type, placeholder, label, name, value, onChange, pattern, title,
    widthClass = 'w-full', otherClass, required, autoComplete = 'off', max }: InputProps) => {
    return (
        <main className="flex flex-col gap-y-1">
            {label && (
                <label className="text-[11px] text-foreground md:text-xs xl:text-sm cursor-pointer" htmlFor={name}>
                    {label}
                    {required && <span className="text-destructive"> *</span>}
                </label>
            )}
            <input type={type} placeholder={placeholder}
                id={name} value={value} onChange={onChange} pattern={pattern}
                title={title} autoComplete={autoComplete} name={name} maxLength={max}
                className={`px-4 py-3 bg-background rounded-lg border border-border duration-300 focus:caret-primary focus:border-primary focus:outline-none placeholder:text-[11px] md:placeholder:text-xs xl:placeholder:text-sm placeholder:text-muted-foreground ${widthClass} ${otherClass}`}
                required={required}
            />
        </main>
    );
};

export default Input;
