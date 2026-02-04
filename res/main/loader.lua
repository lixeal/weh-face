local lp = game:GetService("Players").LocalPlayer
local activeAutoRespawns = {}

-- ВОЗВРАЩЕННАЯ ПОЛНАЯ БИБЛИОТЕКА
local Library = {
    {
        Class = "Head",
        Name = "FaceHead",
        MeshID = "rbxassetid://76877570105127",
        TextureID = "rbxassetid://121827081031002",
        Scale = Vector3.new(1.0, 1.0, 1.0)
    },
    {
        Class = "Script",
        Name = "OldDXB",
        URL = "https://weh-face.vercel.app/old-DXBRE"
    },
    {
        Class = "Body",
        Name = "Custom",
        Torso = "rbxassetid://27493004",
        LeftArm = "rbxassetid://27400132",
        RightArm = "rbxassetid://27400198",
        LeftLeg = "rbxassetid://27493033",
        RightLeg = "rbxassetid://27493073"
    },
    {
        Class = "Outfit",
        Name = "Maid",
        ShirtID = "rbxassetid://8913691200",
        PantsID = "rbxassetid://8913657959"
    },
    {
        Class = "Outfit",
        Name = "Bape",
        ShirtID = "rbxassetid://12594352160",
        PantsID = "rbxassetid://4748004844"
    },
    {
        Class = "Outfit",
        Name = "Clown",
        ShirtID = "rbxassetid://6280071638",
        PantsID = "rbxassetid://11760797553"
    },
    {
        Class = "Accessory",
        Name = "Hat",
        Weld = "Head",
        MeshID = "rbxassetid://73083430479187",
        Texture = "rbxassetid://104381302798685",
        CFrame = CFrame.new(-0.013, 0.1, -0.005, 1, 0, 0, 0, 1, 0, 0, 0, 1)
    },
    {
        Class = "Animation",
        Name = "New",
        IdleID = "rbxassetid://0",
        WalkID = "rbxassetid://0",
        RunID = "rbxassetid://0",
        JumpID = "rbxassetid://0",
        FallID = "rbxassetid://0",
        PoseID = "rbxassetid://0"
    },
    {
        Class = "Face",
        Name = "Default",
        ID = "rbxassetid://0"
    }
}

-- ЛОГИКА ПРИМЕНЕНИЯ
local function Apply(data)
    local char = lp.Character
    if not char then return end

    if data.Class == "Head" then
        local h = char:WaitForChild("Head")
        local m = h:FindFirstChildOfClass("SpecialMesh") or Instance.new("SpecialMesh", h)
        m.MeshId = data.MeshID; m.TextureId = data.TextureID
        if data.Scale then m.Scale = data.Scale end
        if h:FindFirstChild("face") then h.face.Transparency = 1 end
    elseif data.Class == "Accessory" then
        local target = char:FindFirstChild(data.Weld)
        if target then
            local p = Instance.new("Part", char); p.Name = "G_Item_"..data.Name
            p.CanCollide = false; p.Massless = true
            local m = Instance.new("SpecialMesh", p); m.MeshId = data.MeshID; m.TextureId = data.Texture
            local w = Instance.new("Weld", p); w.Part0 = target; w.Part1 = p; w.C1 = data.CFrame
        end
    elseif data.Class == "Script" then
        task.spawn(function()
            local s, c = pcall(game.HttpGet, game, data.URL)
            if s then local f = loadstring(c) if f then f() end end
        end)
    elseif data.Class == "Outfit" then
        local s = char:FindFirstChildOfClass("Shirt") or Instance.new("Shirt", char)
        s.ShirtTemplate = data.ShirtID
        local p = char:FindFirstChildOfClass("Pants") or Instance.new("Pants", char)
        p.PantsTemplate = data.PantsID
    elseif data.Class == "Body" then
        local function bMesh(partName, id)
            local m = char:FindFirstChild(partName.."Mesh") or Instance.new("CharacterMesh", char)
            m.BodyPart = Enum.BodyPart[partName]; m.MeshId = id:match("%d+") or "0"
        end
        bMesh("Torso", data.Torso); bMesh("LeftArm", data.LeftArm); bMesh("RightArm", data.RightArm)
        bMesh("LeftLeg", data.LeftLeg); bMesh("RightLeg", data.RightLeg)
    elseif data.Class == "Animation" then
        local anim = char:FindFirstChild("Animate")
        if anim then
            local function set(n, id) 
                local c = anim:FindFirstChild(n)
                if c and id ~= "rbxassetid://0" then 
                    local o = c:FindFirstChildOfClass("Animation") 
                    if o then o.AnimationId = id end 
                end
            end
            set("idle", data.IdleID); set("walk", data.WalkID); set("run", data.RunID)
            set("jump", data.JumpID); set("fall", data.FallID); set("pose", data.PoseID)
        end
    elseif data.Class == "Face" then
        local h = char:WaitForChild("Head")
        local f = h:FindFirstChild("face") or Instance.new("Decal", h)
        f.Texture = data.ID; f.Transparency = 0
    end
end

-- ОБРАБОТЧИК
local function MainHandler(...)
    local args = {...}
    if #args == 0 then return end
    local a1 = tostring(args[1]):lower()

    -- КРАСИВЫЙ CMD
    if a1 == "cmd" or a1 == "dxb" then
        local list = "--[[\n              DXBRE Command Bar\n      Example | _G(\"Name\", \"true\")\n          _G(\"Name\", \"true/false\")\n\n"
        local cats = {"Script", "Body", "Outfit", "Accessory", "Animation", "Face", "Head"}
        for _, cat in pairs(cats) do
            list = list .. string.format("\n                       %s%s\n", cat, (cat=="Face" or cat=="Head") and "'s" or "s")
            for _, v in pairs(Library) do
                if v.Class == cat then
                    list = list .. string.format("%-11s| %-12s = _G(\"%s\", \"false\")\n", v.Class, v.Name, v.Name)
                end
            end
        end
        list = list .. "\n===========  Clear  ===========\n          _G(\"clear = Name\")\n          _G(\"clear = all\")\n\n--]]"
        print(list)
        if setclipboard then setclipboard(list) end
        return
    end

    -- ИСПРАВЛЕННЫЙ CLEAR (Теперь работает)
    if a1:find("clear =") then
        local target = a1:gsub("clear =%s*", ""):lower()
        local char = lp.Character
        if target == "all" then
            activeAutoRespawns = {}
            if char then
                for _, v in pairs(char:GetChildren()) do
                    if v.Name:find("G_Item_") or v:IsA("CharacterMesh") or v:IsA("Shirt") or v:IsA("Pants") then v:Destroy() end
                end
                if char:FindFirstChild("Head") and char.Head:FindFirstChild("face") then char.Head.face.Texture = "" end
            end
        else
            for k, v in pairs(activeAutoRespawns) do
                if v:lower():find(target) then activeAutoRespawns[k] = nil end
            end
            if char then
                for _, v in pairs(char:GetChildren()) do
                    if v.Name:lower():find(target) then v:Destroy() end
                end
            end
        end
        return
    end

    -- ПРИМЕНЕНИЕ
    local name, auto = tostring(args[1]):lower(), tostring(args[2])
    for _, d in pairs(Library) do
        if d.Name:lower() == name then
            Apply(d)
            if auto == "true" then activeAutoRespawns[d.Class.."-"..d.Name] = d end
            return
        end
    end
end

setmetatable(_G, { __call = function(_, ...) return MainHandler(...) end })

lp.CharacterAdded:Connect(function()
    task.wait(0.8)
    for _, d in pairs(activeAutoRespawns) do Apply(d) end
end)

print("DXBRE FULL Loaded. Script and Clear ready.")
