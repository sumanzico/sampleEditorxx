import React, { useState } from "react";
import "./App.css";

interface Element {
  id: number;
  type: string;
  content?: string;
  imageSrc?: string;
}

const App: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [dragging, setDragging] = useState<Element | null>(null);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, type: string) => {
    setDragging({ id: Date.now(), type });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { type } = dragging as Element;
    const newElement: Element = { id: Date.now(), type };
    setElements((prevElements) => [...prevElements, newElement]);
    setDragging(null);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>, id: number) => {
    const updatedElements = elements.map((element) => {
      if (element.id === id) {
        return { ...element, content: event.target.value };
      }
      return element;
    });
    setElements(updatedElements);
  };

  const handleImageLoad = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const updatedElements = elements.map((element) => {
      if (element.id === id) {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageSrc = event.target?.result as string;
            setElements((prevElements) =>
              prevElements.map((prevElement) => {
                if (prevElement.id === id) {
                  return { ...prevElement, imageSrc };
                }
                return prevElement;
              })
            );
          };
          reader.readAsDataURL(file);
        }
      }
      return element;
    });
    setElements(updatedElements);
  };

  return (
    <div className="container">
      <div className="title">Simple Editor</div>
      <div className="app">
        <div className="sidebar">
          <h5 className="sidebar-title">Sidebar</h5>
          <div
            className="sidebar-item"
            draggable
            onDragStart={(event) => handleDragStart(event, "text")}
          >
            Text
          </div>
          <div
            className="sidebar-item"
            draggable
            onDragStart={(event) => handleDragStart(event, "image")}
          >
            Image
          </div>
        </div>
        <div className="workspace" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
          <h5 className="workspace-title">Workspace</h5>
          {elements.map((element) => {
            if (element.type === "text") {
              return (
                <textarea
                  key={element.id}
                  value={element.content || ""}
                  onChange={(event) => handleTextChange(event, element.id)}
                />
              );
            } else if (element.type === "image") {
              return (
                <div key={element.id}>
                  {element.imageSrc ? (
                    <img src={element.imageSrc} alt="" />
                  ) : (
                    <div className="image-dummy">
                      <input
                        type="file"
                        onChange={(event) => handleImageLoad(event, element.id)}
                      />
                    </div>
                  )}
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
