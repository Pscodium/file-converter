import React, { useRef, useState, useEffect } from 'react';
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
    const [containerHeight, setContainerHeight] = useState(0);
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const updateDimensions = () => {
            const viewportHeight = window.innerHeight;
            const availableHeight = viewportHeight - 90;
            setContainerHeight(availableHeight);

            setIsMobileView(window.innerWidth < 1024);
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const fitSvgToContainer = () => {
        if (!svgContainerRef.current) return;

        const svgElement = svgContainerRef.current.querySelector('svg');
        if (svgElement) {
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.style.maxWidth = '100%';
            svgElement.style.maxHeight = '100%';
            svgElement.style.objectFit = 'contain';
        }
    };

    useEffect(() => {
        if (svgContent) {
            setTimeout(fitSvgToContainer, 100);
        }
    }, [svgContent]);

    return (
        <div
            className='p-2 max-w-full mx-auto'
            style={{
                height: containerHeight,
                overflow: isMobileView ? 'auto' : 'hidden',
            }}
        >
            {!svgContent ? (
                <SvgUploader />
            ) : (
                <div
                    className='bg-white rounded-lg shadow-sm p-2'
                    style={{
                        height: isMobileView ? 'auto' : containerHeight - 10,
                    }}
                >
                    <div className={`${isMobileView ? 'flex-col' : 'flex-col lg:flex-row'} flex gap-2 ${isMobileView ? '' : 'h-full'}`}>
                        {/* SVG Preview */}
                        <div
                            className={`${isMobileView ? 'w-full' : 'lg:w-2/3'} border rounded-lg bg-gray-100 p-2 flex items-center justify-center`}
                            style={{
                                height: isMobileView ? '50vh' : '100%',
                            }}
                        >
                            <div ref={svgContainerRef} className='w-full h-full flex items-center justify-center' dangerouslySetInnerHTML={{ __html: svgContent }} />
                            <SvgPathHighlighter />
                            <SvgSelectionHighlighter />
                            <SvgRealTimeUpdater />
                        </div>

                        {/* Color Editor Panel */}
                        <div
                            className={`${isMobileView ? 'w-full' : 'lg:w-1/3'} bg-gray-50 rounded-lg p-2 flex flex-col`}
                            style={{
                                height: isMobileView ? 'auto' : '100%',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                className='overflow-y-auto flex-grow'
                                style={{
                                    height: isMobileView ? 'auto' : 'calc(100% - 80px)',
                                }}
                            >
                                {/* Edit Mode Toggle */}
                                <div className='mb-2'>
                                    <div className='flex border rounded-md overflow-hidden'>
                                        <button className={`flex-1 py-1 px-2 text-sm ${editMode === 'fill' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setEditMode('fill')}>
                                            Preenchimento
                                        </button>
                                        <button className={`flex-1 py-1 px-2 text-sm ${editMode === 'stroke' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setEditMode('stroke')}>
                                            Contorno
                                        </button>
                                    </div>
                                </div>

                                {/* Export Options */}
                                <SvgExportOptions />

                                {/* Element Selector */}
                                <SvgElementSelector />

                                {/* Color Picker */}
                                <SvgColorPicker />
                            </div>

                            {/* Action Buttons */}
                            <div className='pt-2 mt-auto border-t'>
                                <button onClick={resetColors} className='w-full py-1 px-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center text-sm'>
                                    <IoRefresh className='mr-1' />
                                    Redefinir cores
                                </button>

                                {/* SVG Info */}
                                {svgElements.length > 0 && (
                                    <div className='mt-2'>
                                        <p className='text-xs text-gray-500'>SVG com {svgElements.length} elementos editáveis.</p>
                                    </div>
                                )}
                            </div>
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
