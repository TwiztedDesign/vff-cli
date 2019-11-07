#!/bin/bash

#Generate application uninstallers for macOS.

#Parameters
DATE=`date +%Y-%m-%d`
TIME=`date +%H:%M:%S`
LOG_PREFIX="[$DATE $TIME]"

#Functions
log_info() {
    echo "${LOG_PREFIX}[INFO]" $1
}

log_warn() {
    echo "${LOG_PREFIX}[WARN]" $1
}

log_error() {
    echo "${LOG_PREFIX}[ERROR]" $1
}

#Check running user
if (( $EUID != 0 )); then
    echo "Please run as root."
    exit
fi

echo "Welcome to Application Uninstaller"
echo "The following packages will be REMOVED:"
echo "  __PRODUCT__-__VERSION__"
while true; do
    read -p "Do you wish to continue [Y/n]?" answer
    [[ $answer == "y" || $answer == "Y" || $answer == "" ]] && break
    [[ $answer == "n" || $answer == "N" ]] && exit 0
    echo "Please answer with 'y' or 'n'"
done


#Need to replace these with install preparation script
VERSION=__VERSION__
PRODUCT=__PRODUCT__

echo "Application uninstalling process started"
# remove link to shorcut file
find "/usr/local/bin/" -name "__PRODUCT__-__VERSION__" | xargs rm
if [ $? -eq 0 ]
then
  echo "[1/4] [DONE] Successfully deleted shortcut links"
else
  echo "[1/4] [ERROR] Could not delete shortcut links" >&2
fi

#forget from pkgutil
pkgutil --forget "org.$PRODUCT.$VERSION" > /dev/null 2>&1
if [ $? -eq 0 ]
then
  echo "[2/4] [DONE] Successfully deleted application informations"
else
  echo "[2/4] [ERROR] Could not delete application informations" >&2
fi

#remove application source distribution
[ -e "/Library/${PRODUCT}/${VERSION}" ] && rm -rf "/Library/${PRODUCT}/${VERSION}"
if [ $? -eq 0 ]
then
  echo "[3/4] [DONE] Successfully deleted application"
else
  echo "[3/4] [ERROR] Could not delete application" >&2
fi

#remove from path
WORK=:$PATH:
# WORK => :/bin:/opt/a dir/bin:/sbin:
REMOVE='/Library/__PRODUCT__/__VERSION__'
WORK=${WORK/:$REMOVE:/:}
# WORK => :/bin:/sbin:
WORK=${WORK%:}
WORK=${WORK#:}
PATH=$WORK
#echo $PATH
echo "[4/4] [DONE] Successfully removed from PATH"

echo "Application uninstall process finished"
exit 0
