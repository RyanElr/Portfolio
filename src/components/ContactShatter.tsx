"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { DoubleSide, ExtrudeGeometry, Group, MeshPhysicalMaterial, Shape } from "three";
import overlayStyles from "./GlassOverlay.module.css";
import polygons from "./glassGeometry";

function Glass({ progress }: { progress: RefObject<number> }) {
  const group = useRef<Group>(null);
  const { viewport, invalidate } = useThree();
  const materials = useMemo(() => [
    new MeshPhysicalMaterial({ color: "#ffffff", metalness: 0, roughness: 0.045, transparent: true, opacity: 0.035, clearcoat: 1, clearcoatRoughness: 0.025, reflectivity: 1, envMapIntensity: 2.3, side: DoubleSide, depthWrite: false }),
    new MeshPhysicalMaterial({ color: "#ffffff", metalness: 0, roughness: 0.09, transparent: true, opacity: 0.35, clearcoat: 1, envMapIntensity: 2, side: DoubleSide, depthWrite: false }),
  ], []);
  const pieces = useMemo(() => polygons.map((points, i) => {
    const cx = points.reduce((sum,p) => sum+p[0],0)/points.length;
    const cy = points.reduce((sum,p) => sum+p[1],0)/points.length;
    const shape = new Shape();
    points.forEach(([x,y],n) => {
      const px=(x-cx)/100*viewport.width, py=-(y-cy)/100*viewport.height;
      if (!n) shape.moveTo(px,py); else shape.lineTo(px,py);
    });
    shape.closePath();
    const geometry = new ExtrudeGeometry(shape,{depth:0.014,bevelEnabled:true,bevelThickness:0.004,bevelSize:0.003,bevelSegments:1,steps:1,curveSegments:1});
    return {geometry,x:(cx/100-0.5)*viewport.width,y:(0.5-cy/100)*viewport.height,seed:Math.sin(i*72.31)};
  }),[viewport.width,viewport.height]);
  useEffect(() => () => pieces.forEach(p=>p.geometry.dispose()),[pieces]);
  useEffect(() => () => materials.forEach(m=>m.dispose()),[materials]);
  useEffect(() => {
    const refresh=()=>invalidate();
    window.addEventListener("scroll",refresh,{passive:true});
    return ()=>window.removeEventListener("scroll",refresh);
  },[invalidate]);
  useFrame(()=>{
    if(!group.current) return;
    const p=progress.current;
    group.current.visible=p>0;
    materials[0].opacity=Math.min(1,p*14)*0.035;
    materials[1].opacity=Math.min(1,p*14)*0.35;
    group.current.children.forEach((mesh,i)=>{
      const piece=pieces[i];
      const t=Math.max(0,Math.min(1,(p-0.1-(i%7)*0.009)/0.83));
      const spread=t*t*(3-2*t);
      mesh.position.set(piece.x*(1+spread*0.45),piece.y*(1+spread*0.32)-spread*spread*0.5,(piece.seed*0.65)*spread);
      mesh.rotation.set(piece.seed*0.9*spread,Math.sin(i*5.71)*0.95*spread,Math.sin(i*3.19)*0.55*spread);
    });
  });
  return <>
    <Environment resolution={64} frames={1}>
      <Lightformer position={[-4,3,5]} scale={[1,8,1]} intensity={4} />
      <Lightformer position={[4,0,4]} scale={[0.3,7,1]} intensity={3} />
      <Lightformer position={[0,5,2]} rotation={[Math.PI/2,0,0]} scale={[8,1,1]} intensity={2} />
    </Environment>
    <group ref={group}>{pieces.map((piece,i)=><mesh key={i} geometry={piece.geometry} material={materials} />)}</group>
  </>;
}

export default function ContactShatter() {
  const anchor=useRef<HTMLSpanElement>(null);
  const progress=useRef(0);
  const [active,setActive]=useState(false);
  useEffect(()=>{
    const section=anchor.current?.parentElement;
    if(!section) return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>{
      progress.current=reduced.matches?0:Math.max(0,Math.min(1,(window.innerHeight*0.92-section.getBoundingClientRect().top)/(window.innerHeight*1.12)));
      setActive(progress.current>0);
    };
    const observer=new ResizeObserver(update);
    observer.observe(section);
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    window.addEventListener("pageshow",update);
    reduced.addEventListener("change",update);
    update();
    return ()=>{observer.disconnect();window.removeEventListener("scroll",update);window.removeEventListener("resize",update);window.removeEventListener("pageshow",update);reduced.removeEventListener("change",update);};
  },[]);
  return <><span ref={anchor} aria-hidden="true" />{active && createPortal(
    <div aria-hidden="true" className={overlayStyles.overlay}>
      <Canvas style={{ pointerEvents: "none" }} frameloop="demand" dpr={1} camera={{position:[0,0,8],fov:45}} gl={{alpha:true,antialias:true,powerPreference:"low-power"}} fallback={null}>
        <ambientLight intensity={0.4} />
        <Glass progress={progress} />
      </Canvas>
    </div>,document.body)}</>;
}
