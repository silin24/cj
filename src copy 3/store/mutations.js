

import {
  SAVE_USERLIST,
  SAVE_WINNERLIST,
  SAVE_CARDARR,
  SAVE_AID,
  SAVE_SCREENID,
  SAVE_BGM,
  SAVE_BGVURL,
  SAVE_BGIMG,
  SAVE_ACTIVITYNAME,
  SAVE_COPYRIGHT
} from './mutations-type'



export default {
  [SAVE_USERLIST] (state, userList) {
    state.userList = userList
  },
  [SAVE_WINNERLIST] (state, winnerList) {
    state.winnerList = winnerList
  },
  [SAVE_CARDARR] (state, cardArr) {
    state.cardArr = cardArr
  },
  [SAVE_AID] (state, aId) {
    state.aId = aId
  },
  [SAVE_SCREENID] (state, screenId) {
    state.screenId = screenId
  },
  [SAVE_BGM] (state, bgm) {
    state.bgm = bgm
  },
  [SAVE_BGVURL] (state, bgvUrl) {
    state.bgvUrl = bgvUrl
  },
  [SAVE_BGIMG] (state, bgImage) {
    state.bgImage = bgImage
  },
  [SAVE_COPYRIGHT] (state, copyright) {
    state.copyright = copyright
  },
  [SAVE_ACTIVITYNAME] (state, activityName) {
    state.activityName = activityName
  },
}
