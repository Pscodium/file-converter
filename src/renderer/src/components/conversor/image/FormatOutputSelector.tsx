import { useImageConversor } from './ImageConversorContext';

const availableFormats = ['png', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico'];

const FormatOutputSelector = () => {
    const { outputFormat, setOutputFormat, inputFormat } = useImageConversor();

    const filteredFormats = availableFormats.filter((format) => format !== inputFormat);

    return (
        <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-1'>Formato de saída:</label>
            <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className='w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition'
            >
                {filteredFormats.map((format, index) => (
                    <option key={index} value={format}>
                        {format.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormatOutputSelector;
