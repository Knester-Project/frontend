const ErrorText = ({ message }: { message: string| undefined }) => {
    return (
        <p className="mt-1 max-w-[50ch] text-red-600 text-xs lg:text-sm">{message}</p>
    );
}

export default ErrorText;