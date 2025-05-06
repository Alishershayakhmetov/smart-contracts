import { CircularProgress, Typography } from "@mui/material";

export default function CertificatesLoading() {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="text-center space-y-8 max-w-md">
                <div className="flex justify-center space-x-4">
                    <CircularProgress color="success" />
                    <div className="flex items-center space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-green rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>

                <Typography variant="h6" className="text-green">
                    Retrieving your certificates
                </Typography>

                <Typography
                    variant="caption"
                    className="text-gray-500 block mt-4"
                >
                    Securely fetching data from the blockchain...
                </Typography>
            </div>
        </div>
    );
}
