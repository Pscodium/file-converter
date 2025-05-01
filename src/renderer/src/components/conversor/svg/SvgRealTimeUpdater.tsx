import React, { useEffect, useRef } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';

/**
 * Component to ensure real-time updates of SVG element colors
 * Acts as a direct DOM manipulator for immediate feedback
 */
const SvgRealTimeUpdater: React.FC = () => {
    const { svgElements, svgContent } = useSvgColorEditor();

    const prevElementsRef = useRef<typeof svgElements>([]);

    useEffect(() => {
        if (!svgContent) return;

        svgElements.forEach((element) => {
            const prevElement = prevElementsRef.current.find((prev) => prev.id === element.id);

            if (!prevElement) return;

            const fillChanged = prevElement.currentFill !== element.currentFill;
            const strokeChanged = prevElement.currentStroke !== element.currentStroke;

            if (!fillChanged && !strokeChanged) return;

            const svgContainer = document.querySelector('svg');
            if (!svgContainer) return;

            const svgElement = svgContainer.querySelector(`#${element.id}`) || svgContainer.querySelector(`[id="${element.id}"]`);

            if (svgElement) {
                console.log(`Directly updating element ${element.id} in real-time`);

                if (fillChanged && element.currentFill !== null) {
                    svgElement.setAttribute('fill', element.currentFill);
                }

                if (strokeChanged && element.currentStroke !== null) {
                    svgElement.setAttribute('stroke', element.currentStroke);
                }
            }
        });

        prevElementsRef.current = [...svgElements];
    }, [svgElements, svgContent]);

    return null;
};

export default SvgRealTimeUpdater;
