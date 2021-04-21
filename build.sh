cd etl
python scrape.py
python analyze.py
cd -

cp -R etl/data web/

cd web
npm run build:prod
cd -

cp -R web/dist/* docs
