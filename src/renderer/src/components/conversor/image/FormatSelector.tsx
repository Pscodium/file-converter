import { useImageConversor } from './ImageConversorContext';

const availableFormats = ['svg', 'png', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico'];

const FormatSelector = () => {
    const { inputFormat, setInputFormat } = useImageConversor();

    return (
        <div className='mb-4'>
            <label className='block text-gray-700'>Formato de entrada:</label>
            <select value={inputFormat} onChange={(e) => setInputFormat(e.target.value)} className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2'>
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
