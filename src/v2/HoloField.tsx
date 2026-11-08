import { useEffect, useRef, useState } from "react";
export function HoloField({
  enabled,
  calm = false,
}: {
  enabled: boolean;
  calm?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled || !canvas.current) return;
    const el = canvas.current,
      gl = el.getContext("webgl", {
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    if (!gl) {
      setFailed(true);
      return;
    }
    let raf = 0,
      visible = true,
      last = 0;
    const vertex = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fragment =
      "precision mediump float;uniform vec2 resolution;uniform float time;float scene(vec3 p){float a=length(p-vec3(sin(time*.21)*.35,cos(time*.17)*.2,0.))-.82;float b=length(p-vec3(.75,-.3,.3))-.44;return min(a,b);}void main(){vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;vec3 ro=vec3(0.,0.,3.8),rd=normalize(vec3(uv,-1.8));float d=0.;for(int i=0;i<48;i++){float s=scene(ro+rd*d);if(s<.002||d>7.)break;d+=s;}vec3 p=ro+rd*d;vec3 c=vec3(.025,.03,.045);if(d<7.){vec2 e=vec2(.003,0.);vec3 n=normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy),scene(p+e.yxy)-scene(p-e.yxy),scene(p+e.yyx)-scene(p-e.yyx)));float rim=pow(1.-max(dot(n,-rd),0.),2.);float light=max(dot(n,normalize(vec3(-1.,2.,2.))),0.);vec3 hue=.5+.5*cos(vec3(0.,2.,4.)+p.y*5.+time*.2);c=mix(vec3(.035,.05,.07),hue,light*.24+rim*.8);c+=vec3(.25,.4,.02)*rim;}gl_FragColor=vec4(c,1.);}";
    const compile = (type: number, code: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, code);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        throw Error("Shader compilation unavailable");
      }
      return s;
    };
    let program: WebGLProgram | null = null,
      buffer: WebGLBuffer | null = null;
    try {
      const vs = compile(gl.VERTEX_SHADER, vertex),
        fs = compile(gl.FRAGMENT_SHADER, fragment);
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw Error("Shader link failed");
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const pos = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
      const resolution = gl.getUniformLocation(program, "resolution"),
        time = gl.getUniformLocation(program, "time");
      const render = (now: number) => {
        if (now - last < 33 && !calm) {
          raf = requestAnimationFrame(render);
          return;
        }
        last = now;
        const rect = el.getBoundingClientRect(),
          scale = Math.min(1, 800 / Math.max(rect.width, 1));
        el.width = Math.max(1, Math.floor(rect.width * scale));
        el.height = Math.max(1, Math.floor(rect.height * scale));
        gl.viewport(0, 0, el.width, el.height);
        gl.uniform2f(resolution, el.width, el.height);
        gl.uniform1f(time, calm ? 0 : now / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!calm && visible && !document.hidden)
          raf = requestAnimationFrame(render);
      };
      const refresh = () => {
        cancelAnimationFrame(raf);
        if (visible && !document.hidden) raf = requestAnimationFrame(render);
      };
      const observer = new IntersectionObserver((e) => {
        visible = e[0].isIntersecting;
        refresh();
      });
      observer.observe(el);
      const resize = new ResizeObserver(refresh);
      resize.observe(el);
      document.addEventListener("visibilitychange", refresh);
      const lost = (e: Event) => {
        e.preventDefault();
        cancelAnimationFrame(raf);
        setFailed(true);
      };
      el.addEventListener("webglcontextlost", lost);
      refresh();
      return () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
        resize.disconnect();
        document.removeEventListener("visibilitychange", refresh);
        el.removeEventListener("webglcontextlost", lost);
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
      };
    } catch {
      setFailed(true);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    }
  }, [enabled, calm]);
  if (!enabled) return null;
  return (
    <>
      <canvas ref={canvas} className="v2-holo-field" aria-hidden="true" />
      {failed && (
        <span className="v2-webgl-fallback">
          WebGL unavailable · static visual fallback active
        </span>
      )}
    </>
  );
}
