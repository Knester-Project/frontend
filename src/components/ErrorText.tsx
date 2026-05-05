const ErrorText = ({ message }: { message: string| undefined }) => {
    return (
        <p className="mt-1 max-w-[50ch] text-[11px] text-red-600 md:text-xs xl:text-sm montserrat">{message}</p>
    );
}

export default ErrorText;