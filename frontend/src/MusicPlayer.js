import YoutubePlayer from "./YoutubePlayer";
import SpotifyPlayer from "./SpotifyPlayer";

function MusicPlayer({currentSong, onNext}){
    if (!currentSong){
        return <p>No song selected.</p>
    }

    if (currentSong.platform === "youtube"){
        return (
            <YoutubePlayer
                videoId={currentSong.media_id}
                onNext={onNext}
            />
        );
    }

    if (currentSong.platform === "spotify"){
        return (
            <SpotifyPlayer
                spotifyUri={currentSong.media_id}
            />
        );
    }
    return <p>This link type is not supported yet.</p>
}

export default MusicPlayer;