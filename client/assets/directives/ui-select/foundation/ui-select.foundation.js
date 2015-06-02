angular
    .module("ui.select")
    .run([
        "$templateCache", function ($templateCache) {
            $templateCache.put("foundation/choices.tpl.html", "");
            $templateCache.put("foundation/match-multiple.tpl.html", "");
            $templateCache.put("foundation/match.tpl.html", "");
            $templateCache.put("foundation/select-multiple.tpl.html", "");
            $templateCache.put("foundation/select.tpl.html", "");
        }
    ]);