import { useState, useRef, useEffect } from "react";

//different types of whitenoise
const SOUNDS = [
    {
        id: "rain",
        label: "Rain",
        icon: "🌧",
        color: "#a8c8e8",
        generate: (ctx) => createFilteredNoise(ctx, "bandpass", 400, 8),
    },
    {
        id: "forest",
        label: "Forest",
        icon: "🌿",
        color: "#9acca4",
        generate: (ctx) => createFilteredNoise(ctx, "bandpass", 800, 4),
    },
    {
        id: "ocean",
        label: "Ocean",
        icon: "🌊",
        color: "#7ab8d8",
        generate: (ctx) => createFilteredNoise(ctx, "lowpass", 300, 6),
    },
    {
        id: "whitenoise",
        label: "White Noise",
        icon: "〰",
        color: "#c8b8d8",
        generate: (ctx) => createFilteredNoise(ctx, "allpass", 1000, 1),
    },
    {
        id: "fire",
        label: "Fireplace",
        icon: "🔥",
        color: "#e8a880",
        generate: (ctx) => createFilteredNoise(ctx, "lowpass", 200, 10),
    },
    {
        id: "cafe",
        label: "Café",
        icon: "☕",
        color: "#c8a87a",
        generate: (ctx) => createFilteredNoise(ctx, "bandpass", 1200, 3),
    },
];

function createFilteredNoise(ctx, type, frequency, Q) {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = Q;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.6;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();

    return { source, gainNode };
}

function WhiteNoisePlayer() {
    const [activeId, setActiveId] = useState(null);
    const [volume, setVolume] = useState(60);
    const ctxRef = useRef(null);
    const nodesRef = useRef(null);

    useEffect(() => {
        return () => stopSound();
    }, []);

    function stopSound() {
        if (nodesRef.current) {
            try {
                nodesRef.current.source.stop();
            } catch (_) {}
            nodesRef.current = null;
        }
    }

    function toggleSound(sound) {
        if (activeId === sound.id) {
            stopSound();
            setActiveId(null);
            return;
        }

        stopSound();

        if (!ctxRef.current || ctxRef.current.state === "closed") {
            ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctxRef.current.state === "suspended") {
            ctxRef.current.resume();
        }

        const nodes = sound.generate(ctxRef.current);
        nodes.gainNode.gain.value = volume / 100;
        nodesRef.current = nodes;
        setActiveId(sound.id);
    }

    function handleVolumeChange(e) {
        const val = Number(e.target.value);
        setVolume(val);
        if (nodesRef.current) {
            nodesRef.current.gainNode.gain.value = val / 100;
        }
    }

    const active = SOUNDS.find(s => s.id === activeId);

    return (
        <div className="noise-player">
            <div className="noise-header">
                <span className="noise-title">Ambient Sounds</span>
                {active && (
                    <span className="noise-playing">
                        {active.icon} {active.label}
                    </span>
                )}
            </div>

            <div className="noise-grid">
                {SOUNDS.map((sound) => (
                    <button
                        key={sound.id}
                        className={`noise-btn ${activeId === sound.id ? "noise-btn--active" : ""}`}
                        style={{ "--accent": sound.color }}
                        onClick={() => toggleSound(sound)}
                    >
                        <span className="noise-btn-icon">{sound.icon}</span>
                        <span className="noise-btn-label">{sound.label}</span>
                    </button>
                ))}
            </div>

            <div className="noise-volume">
                <span className="noise-vol-label">Volume</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="noise-slider"
                />
                <span className="noise-vol-value">{volume}%</span>
            </div>
        </div>
    );
}

export default WhiteNoisePlayer;