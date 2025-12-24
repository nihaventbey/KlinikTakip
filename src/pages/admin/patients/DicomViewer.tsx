import React, { useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneTools from 'cornerstone-tools';
import dicomParser from 'dicom-parser';
import hammer from 'hammerjs';

// --- Cornerstone and Tools Initialization ---
// This should only run once in the application's lifecycle.
// We configure it here, but in a larger app, this would go in an entry file.
try {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.Hammer = hammer;
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneTools.init({
        showSVGCursors: true,
    });

    cornerstoneWADOImageLoader.webWorkerManager.initialize({
        maxWebWorkers: navigator.hardwareConcurrency || 1,
        startWebWorkersOnDemand: true,
        webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.min.js', // This needs to be available in your public folder
        taskConfiguration: {
            decodeTask: {
                initializeCodecsOnStartup: false,
                usePDFJS: false,
                strict: false,
            },
        },
    });
} catch (error) {
    console.error("Failed to initialize Cornerstone adapters", error);
    // In a real app, you might want to handle this more gracefully.
}

interface DicomViewerProps {
  fileUrl: string;
}

export default function DicomViewer({ fileUrl }: DicomViewerProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element || !fileUrl) {
            return;
        }

        // Enable the viewport
        cornerstone.enable(element);

        const imageId = `wadouri:${fileUrl}`;

        const loadImage = async () => {
            try {
                const image = await cornerstone.loadImage(imageId);
                cornerstone.displayImage(element, image);
                
                // Enable basic tools
                cornerstoneTools.addTool(cornerstoneTools.ZoomMouseWheelTool);
                cornerstoneTools.addTool(cornerstoneTools.PanTool);
                cornerstoneTools.addTool(cornerstoneTools.WwwcTool);

                cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 0 }); // No button, just wheel
                cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 }); // Left mouse
                cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 2 }); // Right mouse

            } catch (error) {
                console.error('Error loading DICOM image:', error);
                // You could display an error message in the viewport
            }
        };

        loadImage();

        // Cleanup function
        return () => {
            if (element) {
                try {
                  cornerstone.disable(element);
                } catch(e) {
                  // It might throw an error if element is already gone, ignore it.
                }
            }
        };
    }, [fileUrl]); // Re-run effect when fileUrl changes

    return (
        <div 
            ref={elementRef} 
            className="w-full h-full"
            onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
        >
            {/* Cornerstone will render the image here */}
        </div>
    );
}
