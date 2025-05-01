import React, { useRef } from 'react';
import { IoRefresh } from 'react-icons/io5';
import { SvgColorEditorProvider, useSvgColorEditor } from './SvgColorEditorContext';
import SvgUploader from './SvgUploader';
import SvgElementSelector from './SvgElementSelector';
import SvgColorPicker from './SvgColorPicker';
import SvgPathHighlighter from './SvgPathHighlighter';
import SvgSelectionHighlighter from './SvgSelectionHighlighter';
import SvgRealTimeUpdater from './SvgRealTimeUpdater';
import SvgExportOptions from './SvgExportOptions';

const SvgEditorInner: React.FC = () => {
    const { svgContent, svgElements, editMode, setEditMode, resetColors } = useSvgColorEditor();

    const svgContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className='p-6 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold mt-6 mb-6 text-center text-gray-800'>Editor de Cores SVG</h1>

            {!svgContent ? (
                <SvgUploader />
            ) : (
                <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {/* SVG Preview */}
                        <div className='md:col-span-2 border rounded-lg bg-gray-100 p-4 flex items-center justify-center h-[600px] min-h-[400px]'>
                            <div ref={svgContainerRef} className='w-full h-full flex items-center justify-center' dangerouslySetInnerHTML={{ __html: svgContent }} />
                            <SvgPathHighlighter />
                            <SvgSelectionHighlighter />
                            <SvgRealTimeUpdater />
                        </div>

                        {/* Color Editor Panel */}
                        <div className='bg-gray-50 rounded-lg p-4'>
                            <h3 className='text-lg font-medium text-gray-800 mb-4'>Editar Cores</h3>

                            {/* Edit Mode Toggle */}
                            <div className='mb-4 flex border rounded-md overflow-hidden'>
                                <button className={`flex-1 py-2 px-4 ${editMode === 'fill' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setEditMode('fill')}>
                                    Preenchimento
                                </button>
                                <button className={`flex-1 py-2 px-4 ${editMode === 'stroke' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setEditMode('stroke')}>
                                    Contorno
                                </button>
                            </div>

                            {/* Element Selector */}
                            <SvgElementSelector />

                            {/* Color Picker */}
                            <SvgColorPicker />

                            {/* Action Buttons */}
                            <button onClick={resetColors} className='mt-4 w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center'>
                                <IoRefresh className='mr-1' />
                                Redefinir todas as cores
                            </button>

                            <SvgExportOptions />

                            {/* SVG Info */}
                            {svgElements.length > 0 && (
                                <div className='mt-4 pt-4 border-t border-gray-200'>
                                    <p className='text-xs text-gray-500'>SVG com {svgElements.length} elementos editáveis.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SvgEditor: React.FC = () => {
    return (
        <SvgColorEditorProvider>
            <SvgEditorInner />
        </SvgColorEditorProvider>
    );
};

export default SvgEditor;
