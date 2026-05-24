import "./BackgroundScene.css";

export function BackgroundScene() {
  return (
    <div className="mn-bg-scene" aria-hidden="true">
      <div className="mn-bg-scene__stars" />
      <div className="mn-bg-scene__grid" />
      <div className="mn-bg-scene__glow" />
    </div>
  );
}
