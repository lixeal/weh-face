-- Инициализация глобальной таблицы, если её нет
getgenv().Run = getgenv().Run or {}

local function exec(url)
    local success, code = pcall(game.HttpGet, game, url)
    if success and code then
        local func, err = loadstring(code)
        if func then
            func()
        else
            warn("Ошибка компиляции скрипта: " .. tostring(err))
        end
    else
        warn("Не удалось загрузить скрипт по ссылке: " .. tostring(url))
    end
end

-- Universal
Run.ESPwa = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/combat/ESP.lua") end
Run.LimbExtender_rewrite = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/combat/Limb-Extender.lua") end
Run.Spin = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/combat/Spin.lua") end
Run.Fly = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/movement/fly.lua") end
Run.Cframe = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/movement/cframe-speed.lua") end

-- Animations & Utility
Run.Gaze = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/animations/Gaze/Gaze.lua") end
Run.afem = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/animations/AFEM/AFEM.lua") end
Run.IY = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/fe-scripts/infinity-yield.lua") end
Run.SysBroken = function() exec("https://raw.githubusercontent.com/xellardev/xllr/rb/scripts/sysbrokenU.lua") end
Run.External_Shift = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/movement/external-shift.lua") end
-- Multi — Tool
Run.ExecutorBydzenero = function() exec("https://raw.githubusercontent.com/infyiff/backup/refs/heads/main/executor.lua") end
Run.Executor = function() exec("https://example.com") end
Run.OldConsoleBywally = function() exec("https://raw.githubusercontent.com/infyiff/backup/main/console.lua") end
Run.DexByIY = function() exec("https://raw.githubusercontent.com/infyiff/backup/main/dex.lua") end
-- Games
Run.VDTexRBLX = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/game/violence-district/TexRBLX-script.lua") end
Run.VDTexRBLXRewrite = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/game/violence-district/TexRBLX-Rewrite.lua") end
Run.DisableStopEmote = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/game/violence-district/DisableStopEmote.lua") end
Run.MoonWalk = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/game/violence-district/MoonWalk.lua") end
-- EVADE
Run.WhakazhiHubX = function() exec("https://raw.githubusercontent.com/lixeal/xllr/refs/heads/rb/scripts/game/evade/WhakizashiHubX.lua") end
Run.DaraHub = function() exec("https://darahub.vercel.app/main.lua") end -- COLLAB
-- MM2
Run.ODHMM2 = function() exec("https://api.overdrivehub.xyz/v1/auth") end
Run.XHubMM2 = function() exec("https://raw.githubusercontent.com/Au0yX/Community/main/XhubMM2") end
Run.VertexMM2 = function() exec("https://raw.smokingscripts.org/vertex.lua") end
Run.KronHub = function() exec("https://raw.githubusercontent.com/DevKron/Kron_Hub/main/version_1.0") end
Run.LuaWare = function() exec("https://raw.githubusercontent.com/frencaliber/LuaWareLoader.lw/main/luawareloader.wtf") end
Run.SchoolHub = function() exec("https://raw.githubusercontent.com/IHateSchoolIsCool/FuckCheapShops/main/Schoolhub%20Selector") end
