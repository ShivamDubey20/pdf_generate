import UploadDoc from "../UploadDoc";

const page = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-blue-500 text-white py-6 shadow-md">
                <h2 className="text-3xl font-bold text-center">Just Start</h2>
            </header>
            <main className="py-11 flex flex-col items-center flex-1">
                <UploadDoc />
            </main>
        </div>
    );
};

export default page;
