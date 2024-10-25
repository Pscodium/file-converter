import { useImageConversor } from './ImageConversorContext';

const SizeControl = () => {
    const { width, height, setWidth, setHeight } = useImageConversor();

    return (
        <div className='mb-4'>
            <label className='block text-gray-700'>Tamanho da imagem:</label>
            <div className='flex space-x-2'>
                <input
                    type='number'
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                    className='mt-1 block w-1/2 bg-white border border-gray-300 rounded-md shadow-sm p-2'
                    placeholder='Largura'
                />
                <input
                    type='number'
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value, 10))}
                    className='mt-1 block w-1/2 bg-white border border-gray-300 rounded-md shadow-sm p-2'
                    placeholder='Altura'
                />
            </div>
        </div>
    );
};

export default SizeControl;
