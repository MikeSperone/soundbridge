/**
 * Created by Mike on 8/30/16.
 */


let grain = new Grainread("../../build/"+audioOne, context, 10);
grain.setScatter(28);
grain.setFade(1);
grain.setSpread(2);
//grain.fb_amount(2);
grain.phaseMax(500);
