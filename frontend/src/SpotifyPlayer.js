function SpotifyPlayer({spotifyUri}){
    const parts = spotifyUri.split(":");
    const mediaType = parts[1];
    const mediaId = parts[2];

    const embedUrl = `https://open.spotify.com/embed/${mediaType}/${mediaId}?utm_source=generator`;

    return (
        <div className="platform-player">
            <iframe
                title="Spotify Player"
                src={embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            ></iframe>
        </div>
    );
}

export default SpotifyPlayer;