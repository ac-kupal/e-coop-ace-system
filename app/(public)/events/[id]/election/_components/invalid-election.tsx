const InvalidElection = ({message = "invalid election"} : { message? : string }) => {
    return (
        <div className="flex-1 w-dvw flex flex-col items-center justify-center">
            <p className="text-sm text-center text-foreground/70">{message}</p>
        </div>
    );
};

export default InvalidElection; 
