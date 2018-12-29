// ==UserScript==
// @name         Steam Market - Cancel ALL lots
// @namespace    Shmurdik
// @version      0.1
// @description  Steam Market - Cancel ALL lots
// @author       Shmurdik
// @include      /^http[s]?:\/\/steamcommunity\.com\/market\/$/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $J("a[href*='CancelMarketListingConfirmation']").first().parent().parent().parent().before('<a href="#cancel_all_lots" class="item_market_action_button item_market_action_button_edit nodisable"><span id="cancel_all_lots" class="item_market_action_button_contents">Cancel ALL lots</span></a>');

    function CancelCurrentLots(){
        var canceled = 0;
        var total = $J("a[href*='CancelMarketListingConfirmation']").length;
        if(total <= 0) { alert('Not found lots. Nothing to do.'); return false; }
        var modal = ShowBlockingWaitDialog( 'Executing...', 'Please wait until all requests finish. Ignore all the errors, let it finish.' );

        $J("a[href*='CancelMarketListingConfirmation']").each(function(i, el){
            var res = $J(this).attr("href").match(/CancelMarketListingConfirmation\('[\/]?mylisting', '(\d+)', (\d+), '(\d+)', '(\d+)'\)/i);
            //if(!res) {res = $J(this).html().match(/type="checkbox" class="lfremove" data-listingid="(\d+)"/i);}
            if(res){
                jQuery.post('//steamcommunity.com/market/removelisting/'+res[1],
                            {sessionid: g_sessionID}
                ).always(function(data){
                    canceled++;
                    modal.Dismiss();
                    if(canceled >= total)
                    {
                        modal = ShowBlockingWaitDialog( 'Executing...', 'Canceling is done! Reloading in 5 sec...' );
                        setTimeout(function() { location.reload(); }, 5000);
                        //location.reload();
                    }
                    else
                    {
                        modal = ShowBlockingWaitDialog( 'Executing...', 'Canceled <b>' + canceled + '</b> of ' + total + '.' );
                    }
				});
            }
            else
            {
                modal.Dismiss();
                modal = ShowBlockingWaitDialog( 'Error!', 'Not found CancelMarketListingConfirmation.' );
                //alert($J(this).html());
            }
        });
    }
    $J("#cancel_all_lots").click(function(){
        if(confirm("Cancel ALL lots?")) {CancelCurrentLots();}
    });
})();