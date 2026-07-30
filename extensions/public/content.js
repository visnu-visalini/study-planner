(() => {
    if (document.getElementById("study-planner-sidebar")) return;

    // Sidebar iframe
    const iframe = document.createElement("iframe");
    iframe.id = "study-planner-sidebar";
    iframe.src = chrome.runtime.getURL("sidebar.html");
    iframe.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        border: none;
        z-index: 2147483647;
        box-shadow: -4px 0 24px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        border-radius: 0;
    `;
    document.body.appendChild(iframe);

    // Toggle button
    const btn = document.createElement("button");
    btn.id = "study-planner-toggle";
    btn.innerHTML = "📚";
    btn.title = "Study Planner AI";
    btn.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #6366f1;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        z-index: 2147483646;
        box-shadow: 0 4px 16px rgba(99,102,241,0.5);
        transition: background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(btn);

    let open = false;

    function toggle() {
        open = !open;
        iframe.style.transform = open ? "translateX(0)" : "translateX(100%)";
        btn.innerHTML = open ? "✕" : "📚";
        // Push page content left when sidebar opens
        document.body.style.transition = "margin-right 0.3s cubic-bezier(0.4,0,0.2,1)";
        document.body.style.marginRight = open ? "400px" : "0";
    }

    btn.addEventListener("click", toggle);

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.action === "toggleSidebar") toggle();
    });
})();
