import { useImageConversor } from './ImageConversorContext';

const SizeControl = () => {
    const { width, height, setWidth, setHeight } = useImageConversor();

    return (
        <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-1'>Tamanho da imagem:</label>
            <div className='flex space-x-4'>
                <div className='w-1/2'>
                    <label className='text-sm text-gray-600 mb-1 block'>Largura (px):</label>
                    <div className='relative'>
                        <input
                            type='number'
                            min={1}
                            value={width}
                            onChange={(e) => setWidth(parseInt(e.target.value, 10) || 1)}
                            className='w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition'
                            placeholder='Largura'
                        />
                    </div>
                </div>
                <div className='w-1/2'>
                    <label className='text-sm text-gray-600 mb-1 block'>Altura (px):</label>
                    <div className='relative'>
                        <input
                            type='number'
                            min={1}
                            value={height}
                            onChange={(e) => setHeight(parseInt(e.target.value, 10) || 1)}
                            className='w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition'
                            placeholder='Altura'
                        />
                    </div>
                </div>
            </div>

            <div className='mt-3 flex flex-wrap gap-2'>
                <button
                    onClick={() => {
                        setWidth(640);
                        setHeight(480);
                    }}
                    className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
                >
                    640 × 480
                </button>
                <button
                    onClick={() => {
                        setWidth(800);
                        setHeight(600);
                    }}
                    className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
                >
                    800 × 600
                </button>
                <button
                    onClick={() => {
                        setWidth(1024);
                        setHeight(768);
                    }}
                    className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
                >
                    1024 × 768
                </button>
                <button
                    onClick={() => {
                        setWidth(1280);
                        setHeight(720);
                    }}
                    className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
                >
                    1280 × 720 (HD)
                </button>
                <button
                    onClick={() => {
                        setWidth(1920);
                        setHeight(1080);
                    }}
                    className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
                >
                    1920 × 1080 (Full HD)
                </button>
            </div>
        </div>
    );
};

export default SizeControl;
