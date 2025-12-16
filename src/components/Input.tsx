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
};

const Input = ({ type, placeholder, label, name, value, onChange, pattern, title,
    widthClass = 'w-full', otherClass, required, autoComplete = 'off' }: InputProps) => {
    return (
        <main className="flex flex-col gap-y-1">
            {label && (
                <label className="text-foreground text-xs md:text-sm xl:text-base cursor-pointer" htmlFor={name}>
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}
            <input type={type} placeholder={placeholder}
                id={name} value={value} onChange={onChange} pattern={pattern}
                title={title} autoComplete={autoComplete} name={name}
                className={`px-4 py-3 bg-background rounded-lg border border-border duration-300 focus:caret-primary focus:border-primary focus:outline-none placeholder:text-xs md:placeholder:text-sm xl:placeholder:text-base placeholder:text-muted ${widthClass} ${otherClass}`}
                required={required}
            />
        </main>
    );
};

export default Input;
