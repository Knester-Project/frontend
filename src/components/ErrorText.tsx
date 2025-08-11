const ErrorText = ({ message }: { message: string| undefined }) => {
    return (
        <p className="mx-auto mt-1 max-w-[50ch] text-center text-red-600 text-xs lg:text-sm">{message}</p>
    );
}

export default ErrorText;