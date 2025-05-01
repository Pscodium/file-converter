/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Window } from './components/window';
import ImageConversor from './components/conversor/image/ImageConversor';
import SvgEditor from './components/conversor/svg/SvgEditor';

type TabType = 'imageConverter' | 'svgEditor';

export default function App() {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [activeTab, setActiveTab] = useState<TabType>('imageConverter');

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Window.Root className='flex flex-col items-center'>
            <Window.Header className='fixed drag shadow-sm flex bg-gray-200 w-full h-7 items-center' />
            <Window.Content className='overflow-auto mt-7 w-full items-center bg-gray-100' style={{ height: windowHeight - 30 }}>
                <div className='px-6 pt-4'>
                    <div className='flex border-b border-gray-300'>
                        <TabButton isActive={activeTab === 'imageConverter'} onClick={() => setActiveTab('imageConverter')}>
                            Conversor de Imagens
                        </TabButton>
                        <TabButton isActive={activeTab === 'svgEditor'} onClick={() => setActiveTab('svgEditor')}>
                            Editor de SVG
                        </TabButton>
                    </div>
                </div>

                {activeTab === 'imageConverter' && <ImageConversor />}
                {activeTab === 'svgEditor' && <SvgEditor />}
            </Window.Content>
        </Window.Root>
    );
}

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => {
    return (
        <button className={`py-2 px-4 font-medium text-sm transition-colors ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`} onClick={onClick}>
            {children}
        </button>
    );
};
