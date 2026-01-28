local HttpService = game:GetService("HttpService")
local infoPath = "auraware/wf/info.json"

-- [Универсальная функция запроса]
-- Обходит блокировку PostAsync через request() твоего эксплоита
local function wf_request(url, data)
    local jsonBody = HttpService:JSONEncode(data)
    -- Пробуем найти стандартные функции эксплоитов
    local request_func = (syn and syn.request) or (http and http.request) or http_request or request
    
    if request_func then
        local response = request_func({
            Url = url,
            Method = "POST",
            Headers = { ["Content-Type"] = "application/json" },
            Body = jsonBody
        })
        return { Success = (response.StatusCode == 200), Body = response.Body }
    else
        -- Если это обычный Roblox Studio (для тестов)
        local success, result = pcall(function()
            return HttpService:PostAsync(url, jsonBody, Enum.HttpContentType.ApplicationJson)
        end)
        return { Success = success, Body = result }
    end
end

local wf = {}

-- [Функция: Регистрация]
function wf.register(user, pass)
    print("[WF]: Попытка регистрации пользователя: " .. tostring(user))
    local res = wf_request("https://weh-face.vercel.app/register", {
        user = tostring(user),
        pass = tostring(pass)
    })
    
    if res.Success then
        if res.Body:find("AUTH_SUCCESS") then
            -- Сохраняем данные локально
            if not isfolder("auraware/wf") then 
                makefolder("auraware")
                makefolder("auraware/wf") 
            end
            local rawData = res.Body:split("|")[2]
            writefile(infoPath, rawData)
            print("[WF]: Аккаунт успешно создан и сохранен в workspace!")
        else
            print("[WF Server]: " .. tostring(res.Body))
        end
    else
        warn("[WF Error]: " .. tostring(res.Body))
    end
end

-- [Функция: Загрузка файла]
function wf.add(path, content)
    if not isfile(infoPath) then
        return print("[WF]: Сначала зарегистрируйтесь через _G.wf.register")
    end
    
    local creds = HttpService:JSONDecode(readfile(infoPath))
    print("[WF]: Загрузка файла " .. path .. "...")
    
    local res = wf_request("https://weh-face.vercel.app/execute", {
        user = creds.username,
        pass = creds.password,
        command = "add file " .. path .. " =\n" .. content
    })
    
    if res.Success then
        print("[WF]: Файл успешно залит!")
    else
        warn("[WF Error]: " .. tostring(res.Body))
    end
end

_G.wf = wf
print("---------------------------------------")
print("[WEH-FACE] Core Loaded Successfully!")
print("Используйте: _G.wf.register('nick', 'pass')")
print("---------------------------------------")
