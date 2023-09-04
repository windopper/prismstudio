#include <bits/stdc++.h>

using namespace std;

int N, M, K;
int candies[30001];
vector<vector<int>> adj(30001);
int dp[30001][3001];
int vis[30001];

int solve(int cur, int curCnt) {
    if (cur == N + 1) return 0;
    int &ret = dp[cur][curCnt];
    if (ret != -1) return ret;

    int cnt = 1;
    int sum = candies[cur];
    vis[cur] = 1;
    queue<int> q;
    q.push(cur);
    while(!q.empty()) {
        int c = q.front();
        q.pop();
        for (int next : adj[c]) {
            if (vis[next]) continue;
            vis[next] = 1;
            sum += candies[next];
            ++cnt;
            q.push(next);
        }
    }

    if (cnt + curCnt < K) {
        int next = N + 1;
        for (int i = cur + 1; i <= N; i++) {
            if (vis[i]) continue;
            next = i;
            break;
        }
        ret = max(ret, solve(next, curCnt + cnt) + sum);
    }

    vis[cur] = 0;
    q.push(cur);
    while(!q.empty()) {
        int c = q.front();
        q.pop();
        for (int next : adj[c]) {
            if (vis[next]) {
                vis[next] = 0;
                q.push(next);
            }
        }
    }

    int next = N + 1;
    for (int i=cur + 1; i<=N; i++) {
        if (vis[i]) continue;
        next = i;
        break;
    }
    ret = max(ret, solve(next, curCnt));
    return ret;
}   

int main() {
    ios_base::sync_with_stdio(false); cin.tie(0); cout.tie(0);
    memset(dp, -1, sizeof(dp));
    memset(vis, 0, sizeof(vis));
    cin >> N >> M >> K;

    for (int i=1; i<=N; i++) {
        cin >> candies[i];
    }

    for (int i=0; i<M; i++) {
        int a, b; 
        cin >> a >> b;
        adj[a].push_back(b);
        adj[b].push_back(a);
    }

    int ans = 0;
    cout << solve(1, 0);
}