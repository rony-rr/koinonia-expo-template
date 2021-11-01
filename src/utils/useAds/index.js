import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from "expo-ads-admob";

/** Variables globales de ambiente */
import GlobalVars from "../../global/globalVars";

const showAdsIntersticial = async () => {
    await AdMobInterstitial.setAdUnitID(GlobalVars.intersticialAdsCode);
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
    await AdMobInterstitial.showAdAsync();
  }

export default {
    showAdsIntersticial,
};