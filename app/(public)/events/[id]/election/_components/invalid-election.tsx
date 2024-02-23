const InvalidElection = ({message = "invalid election"} : { message? : string }) => {
    return (
        <div className="h-dvh w-dvw flex items-center justify-center">
            <p className="text-sm text-foreground/70">{message}</p>
        </div>
    );
};

export default InvalidElection; 
