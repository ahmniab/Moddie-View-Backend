export const enum SocketEvents {
    CONNECTION                              = "connection",
    DISCONNECT                              = "disconnect",

    GET_ROOM_DATA                           = "CMD:getRoomData",
    SET_ROOM_NAME                           = "CMD:room.name",
    SET_USER_NAME                           = "CMD:user.name",
    USERS_UPDATE                            = "CMD:usersUpdate",

    CONTENT_CHANGE                          = "CONTENT:change",
    CONTENT_VIDEO_PLAY                      = "CONTENT:video.play",
    CONTENT_VIDEO_PAUSE                     = "CONTENT:video.pause",
    CONTENT_VIDEO_SEEK                      = "CONTENT:video.seek",
    CONTENT_VIDEO_PLAYBACK_RATE_CHANGE      = "CONTENT:video.playbackRateChange",
    CONTENT_VIDEO_CHANGE_PLAYBACK_RATE      = "CONTENT:video.changePlaybackRate",
    INITIALIZE_VIDEO                        = "CONTENT:video.initialize",

    CHAT_MESSAGE                            = "CHAT:chatMessage",
    NEW_CHAT_MESSAGE                        = "CHAT:newChatMessage",
    CHAT_REACT_ON_MESSAGE                   = "CHAT:reactOnMessage",
    NEW_CHAT_REACTION                       = "CHAT:newChatReaction",
}