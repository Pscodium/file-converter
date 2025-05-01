import { useImageConversor } from './ImageConversorContext';

const availableFormats = ['svg', 'png', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico'];

const FormatSelector = () => {
    const { inputFormat, setInputFormat, clearImages } = useImageConversor();

    const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setInputFormat(e.target.value);
        clearImages();
    };

    return (
        <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-1'>Formato de entrada:</label>
            <select
                value={inputFormat}
                onChange={handleFormatChange}
                className='w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition'
            >
                {availableFormats.map((format) => (
                    <option key={format} value={format}>
                        {format.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormatSelector;
