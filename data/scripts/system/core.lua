local HttpService = game:GetService("HttpService")
local infoPath = "auraware/wf/info.json"

local function internal_request(url, payload)
    local jsonBody = HttpService:JSONEncode(payload)
    local req_func = (syn and syn.request) or (http and http.request) or http_request or request
    
    if req_func then
        local res = req_func({
            Url = url,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json",
                ["Accept"] = "application/json"
            },
            Body = jsonBody
        })
        return {Success = (res.StatusCode == 200), Body = res.Body}
    else
        -- Если нет спец-функций, пробуем обычный (может не сработать из-за защиты)
        local success, res = pcall(function()
            return HttpService:PostAsync(url, jsonBody, Enum.HttpContentType.ApplicationJson)
        end)
        return {Success = success, Body = res}
    end
end

local wf = {}

function wf.register(user, pass)
    local data = {
        command = "create account", -- Передаем команду отдельно, если нужно
        user = user, 
        pass = pass
    }
    print("[WF]: Отправка регистрации...")
    local res = internal_request("https://weh-face.vercel.app/register", data)
    
    if res.Success then
        if res.Body:find("AUTH_SUCCESS") then
            if not isfolder("auraware/wf") then makefolder("auraware/wf") end
            local jsonData = res.Body:split("|")[2]
            writefile(infoPath, jsonData)
            print("[WF]: Успех! Аккаунт привязан.")
        else
            print("[WF Server]: " .. tostring(res.Body))
        end
    else
        print("[WF Error]: " .. tostring(res.Body))
    end
end

_G.wf = wf
