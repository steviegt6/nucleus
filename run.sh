echo "Packing asar..."
./scripts/injectPolyfills.sh
asar pack src app.asar # Package asar
# asar list app.asar # List asar for debugging / testing

echo "Copying asar..."
cp app.asar "C:\Users\xxlen\AppData\Local\DiscordCanary\app-1.0.53\resources\app.asar" # Overwrite app.asar for Linux Canary

echo "Running discord..."
echo ""

start "C:\Users\xxlen\AppData\Local\DiscordCanary\app-1.0.53\DiscordCanary.exe" # run it
