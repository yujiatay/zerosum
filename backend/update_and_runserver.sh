git pull
. govars.sh
cd src/zerosum
packr build -o ../../bin/zerosum
cd ../..
sudo -E ./bin/zerosum
