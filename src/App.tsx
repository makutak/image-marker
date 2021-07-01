import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CanvasArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const App = () =>{
  const createObjectURL = (window.URL || window.webkitURL).createObjectURL;
  const [imgSrc, setImgSrc] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const c: HTMLCanvasElement = canvasRef.current;
      const ctx = c.getContext("2d");
      setCanvas(c);
      setContext(ctx);
      console.log('context: ', context === null);

    }
  }, [context])

  useEffect(() => {
    if (canvas !== null) {
      const onClick = (e: any) => {
        console.log('onClick');
        console.log('context is null', context !== null);
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        console.log("x: ", x, "y: ", y);
        if (context !== null) {
          console.log('fill rect');
          context.fillStyle = 'orange';
          context.fillRect(x, y, 30, 30);
        }
      };
  
      canvas.addEventListener('click', onClick, false);
    }
  }, [canvas, context]);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files !== null) {
      const file = e.currentTarget.files[0];
      console.log(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const src  = reader.result as string;
        drawImage(src);
      };
      const imgUrl = e.currentTarget.files[0]; //;createObjectURL(file);
      setImgSrc(createObjectURL(imgUrl));
    }
  };
  
  const drawImage = (src: string) => {
    console.log('drawImage');

    const img = new Image();
    const zoom = 0.5;
    
    img.src = src!;
    img.onload = () => {
      canvas!.width = img.width * zoom;
      canvas!.height = img.height * zoom;
      context?.drawImage(img, 0, 0, img.width * zoom, img.height * zoom);
    }
  };


  return (
    <>
    <Container>
      <ImgContainer>
        <p>image</p>
        <img src={imgSrc} width="50%" height="auto" alt=""/>
      </ImgContainer>
      <CanvasArea>
        <p>canvas</p>
        <canvas ref={canvasRef} id="canvas" />
        <br />
      </CanvasArea>
    </Container>
    <input type="file" onChange={handleChangeFile} />        
    </>
  );
}

export default App;
